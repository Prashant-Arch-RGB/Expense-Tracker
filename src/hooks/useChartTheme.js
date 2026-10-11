import { useState, useEffect } from 'react';

const LIGHT = {
  tickColor: '#444a53',
  gridColor: 'rgba(0,0,0,0.06)',
};

const DARK = {
  tickColor: '#8ea5c5',
  gridColor: 'rgba(255,255,255,0.08)',
};

function getVars() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  return isDark ? DARK : LIGHT;
}

export function useChartTheme() {
  const [vars, setVars] = useState(getVars);

  useEffect(() => {
    const observer = new MutationObserver(() => setVars(getVars()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  return vars;
}
