const loadTahitiScript = async (scriptUrl) => {
    const script = document.createElement('script');
    //script.type = 'module';
    script.src = scriptUrl;
  
    return await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
};
  
export default loadTahitiScript;