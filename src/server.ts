import app from "./app";
import { envVariable } from "./config/env";


const bootstrap=()=>{
    try{
         app.listen(envVariable.PORT,()=>{
             console.log(`server is running on http://localhost:${envVariable.PORT}`)
         })
    }
    catch(error)
    {
         console.error('failed to start server');
    }
}

bootstrap();
