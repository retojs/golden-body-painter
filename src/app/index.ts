import "../style/index.scss";
import { MyApp } from "./app";

window.onload = () => {
    const app = new MyApp("Hello World");
    console.log("App is loaded.", app.message);
};
