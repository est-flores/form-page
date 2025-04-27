import React, { useState } from 'react';

const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success?: boolean;
    message?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({});
    
    try {
      const response = await fetch('https://formula-mailer-proxy.vercel.app/api/messages/pita-con-nudo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSubmitStatus({
          success: true,
          message: "¡Gracias! Nos pondremos en contacto contigo pronto."
        });
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          message: ""
        });
      } else {
        setSubmitStatus({
          success: false,
          message: data.message || "Error al enviar el formulario"
        });
      }
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: "Error de conexión. Intenta nuevamente."
      });
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1">
        <label htmlFor="fullName" className="block text-xs text-white uppercase tracking-wider font-medium">
          NOMBRE
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full bg-white/80 backdrop-blur-sm rounded-xl p-3.5 border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-[#A67E6B]"
          required
          placeholder="Tu nombre completo"
        />
      </div>
      
      <div className="space-y-1">
        <label htmlFor="email" className="block text-xs text-white uppercase tracking-wider font-medium">
          CORREO
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full bg-white/80 backdrop-blur-sm rounded-xl p-3.5 border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-[#A67E6B]"
          required
          placeholder="correo@ejemplo.com"
        />
      </div>
      
      <div className="space-y-1">
        <label htmlFor="phone" className="block text-xs text-white uppercase tracking-wider font-medium">
          TELEFONO
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full bg-white/80 backdrop-blur-sm rounded-xl p-3.5 border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-[#A67E6B]"
          required
          placeholder="Tu número de teléfono"
        />
      </div>
      
      {submitStatus.message && (
        <div className={`p-3 rounded-lg text-center ${submitStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {submitStatus.message}
        </div>
      )}
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#C4937A] hover:bg-[#B58369] text-white py-3.5 px-6 rounded-xl transition-colors mt-6 font-medium disabled:opacity-70"
      >
        {isSubmitting ? "Enviando..." : "Quiero ser parte del cambio"}
      </button>
      
      <p className="text-xs text-center text-white mt-2">
        *Todos los campos son requeridos para crear tu cuenta
      </p>
    </form>
  );
};

export default SignupForm; 