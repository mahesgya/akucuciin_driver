import './index.css'
import Routess from './routes';
import ScrollToTop from './ScrollToTop';
import { BrowserRouter, useRoutes } from "react-router-dom";
import ReactDOM from 'react-dom/client';

const root = ReactDOM.createRoot(document.getElementById("root"));

function AppRoutes() {
  const element = useRoutes(Routess);
  return element;
}

root.render(
 <BrowserRouter>
 <ScrollToTop/>
 <AppRoutes/>
 </BrowserRouter>
);
