// File: /src/components/ParticleContext.jsx

import React, { createContext, useState, useContext, useCallback } from 'react';

const ParticleContext = createContext(null);

export const useParticles = () => useContext(ParticleContext);

export const ParticleProvider = ({ children }) => {
  const [config, setConfig] = useState('hero');

  const setParticleConfig = useCallback((newConfig) => {
    setConfig((current) => (current === newConfig ? current : newConfig));
  }, []);

  return (
    <ParticleContext.Provider value={{ config, setParticleConfig }}>
      {children}
    </ParticleContext.Provider>
  );
};
