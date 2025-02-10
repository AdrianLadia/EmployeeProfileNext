"use client"

import React from "react";

const ThemeControl = () => {

  const themes = [
    "light", "dark", "cupcake", "winter", "wireframe", "lofi",
    "synthwave", "luxury", "dim",  
    "retro", "cyberpunk", "aqua", "valentine"
  ];

  const [ selectedTheme, setSelectedTheme ] = React.useState<string>(localStorage.getItem("theme") || "light");  

  React.useEffect(()=>{
    localStorage.setItem("theme", selectedTheme) 
  },[selectedTheme])

  return (
    <details className="collapse collapse-arrow flex flex-col bg-base-200 border ">  
      <summary className="collapse-title font-medium border-b select-none h-1 text-lg ">Themes ({selectedTheme})</summary> 
      <div className="collapse-content overflow-y-auto">
        <div className="form-control h-[25vh] duration-300  " > 
          {themes.map((theme, index) => (
            <label className="label cursor-pointer gap-4 hover:bg-base-100 "
              key={index}
            >
              <span className="label-text">{theme}</span>
              <input
                type="radio"
                name="theme-radios"
                className="radio theme-controller" 
                checked={selectedTheme === theme}
                onClick={() => setSelectedTheme(theme)} 
                value={theme}
              />
            </label>
          ))}
        </div>
      </div>
    </details >
  );
};

export default ThemeControl;
