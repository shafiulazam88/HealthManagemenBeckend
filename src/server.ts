import app from "./app";


const bootstrap=()=>{
    try{
         app.listen(5000 ,()=>{
             console.log(`server is running on http://localhost:5000`)
         })
    }
    catch(error)
    {
         console.error('failed to start server');
    }
}

bootstrap();
