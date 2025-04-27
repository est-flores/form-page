import React, { useState } from 'react';

const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic for form submission would go here
    console.log("Form submitted:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1">
        <label htmlFor="nombre" className="block text-xs text-white uppercase tracking-wider font-medium">
          NOMBRE
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="w-full bg-white/80 backdrop-blur-sm rounded-xl p-3.5 border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-[#A67E6B]"
          required
          placeholder="Tu nombre completo"
        />
      </div>
      
      <div className="space-y-1">
        <label htmlFor="correo" className="block text-xs text-white uppercase tracking-wider font-medium">
          CORREO
        </label>
        <input
          type="email"
          id="correo"
          name="correo"
          value={formData.correo}
          onChange={handleChange}
          className="w-full bg-white/80 backdrop-blur-sm rounded-xl p-3.5 border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-[#A67E6B]"
          required
          placeholder="correo@ejemplo.com"
        />
      </div>
      
      <div className="space-y-1">
        <label htmlFor="telefono" className="block text-xs text-white uppercase tracking-wider font-medium">
          TELEFONO
        </label>
        <input
          type="tel"
          id="telefono"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          className="w-full bg-white/80 backdrop-blur-sm rounded-xl p-3.5 border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-[#A67E6B]"
          required
          placeholder="Tu número de teléfono"
        />
      </div>
      
      <button
        type="submit"
        className="w-full bg-[#C4937A] hover:bg-[#B58369] text-white py-3.5 px-6 rounded-xl transition-colors mt-6 font-medium"
      >
        Quiero ser parte del cambio
      </button>
      
      <p className="text-xs text-center text-white mt-2">
        *Todos los campos son requeridos para crear tu cuenta
      </p>
    </form>
  );
};

export default SignupForm; 