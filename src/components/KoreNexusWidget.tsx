import React, { useEffect } from "react";

export default function KoreNexusWidget() {
  useEffect(() => {
    const mount = document.getElementById("korenexus-widget");
    if (!mount) return;
    
    // Clear previous elements to avoid multiple appended frames on re-renders
    mount.innerHTML = "";
    
    const f = document.createElement("iframe");
    f.src = "https://k-flow-nexus.lovable.app/embed";
    f.title = "KoreNexus API Widget";
    f.loading = "lazy";
    f.allow = "clipboard-write; clipboard-read; fullscreen";
    f.style.cssText = "width:100%;max-width:720px;height:640px;border:0;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,.18);margin:0 auto;display:block;";
    mount.appendChild(f);
  }, []);

  return (
    <div className="w-full flex justify-center py-2">
      <div id="korenexus-widget" className="w-full max-w-[720px]" />
    </div>
  );
}
