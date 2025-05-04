import { useState } from "react";

export default function useSandbox(){
    const [output,setOutput] = useState('');
    const [isLoading,setIsLoading] = useState(false);

    const execute = async (code,language='javascript')=>{
        setIsLoading(true);
        try{
            const res = await fetch('http://localhost:4000/execute',{
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body:JSON.stringify({code,language})
            });
            const data = await res.json();
            setOutput(data.output || data.error);
        }catch(err){
            setOutput('Failed to connect to sandbox');
        }finally{
            setIsLoading(false)
        }
    }

    return {execute,output,isLoading};
}