import { RouterProvider, createBrowserRouter } from "react-router-dom";
import List from "./pages/List";
import Create from "./pages/Create";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <List />,
    },
    {
      path: "/create",
      element: <Create />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
