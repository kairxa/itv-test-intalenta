import { RouterProvider, createBrowserRouter } from "react-router-dom";
import List from "./pages/List";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <List />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
