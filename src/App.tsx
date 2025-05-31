import { createBrowserRouter, RouterProvider } from "react-router-dom";
import router from "./routes/router";

function App() {
  const renderRoutes = createBrowserRouter(router);
  return <RouterProvider router={renderRoutes} />;
}

export default App;
