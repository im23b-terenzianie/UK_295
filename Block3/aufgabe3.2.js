const express = require('express');
const app = express();
const port = 3001;


app.get('/temperatur/:plz',async (req,res)=>{
   try{
    const plz = req.params.plz;
    const plzFormatted = plz.padEnd(6,'0');
    console.log(plz)
    
    const url = `https://api.open-meteo.com/v1/forecast?latitude=47.38&longitude=8.57&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`
    const response = await fetch(url);
    const data = await response.json();
    const temperatur= data.current.temperature_2m
    res.json({temperatur:`${temperatur}`})
    } catch(err){
    console.log(err)
}
});
app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
})