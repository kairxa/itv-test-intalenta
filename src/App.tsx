import { RouterProvider, createBrowserRouter } from "react-router-dom";
import List from "./pages/List";
import Create from "./pages/Create";
import Edit from "./pages/Edit";
import Detail from "./pages/Detail";

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
    {
      path: "/:id",
      element: <Detail />,
    },
    {
      path: "/:id/edit",
      element: <Edit />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
