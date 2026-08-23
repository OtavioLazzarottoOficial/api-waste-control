import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/page-dashboard";
import LayoutMain from "./pages/layout-main";
import Category from "./pages/page-category";
import Food from "./pages/page-food";
import Waste from "./pages/page-waste";
import Meal from "./pages/page-meal";
import FoodDetails from "./pages/page-details-food";
import Cardapio from "./pages/page-menu";
import SignUp from "./pages/page-signup";
import { AuthProvider } from "./contexts/auth-context";
import { PrivateRoute } from "./components/private-route";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route index element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route element={<LayoutMain />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/category" element={<Category />} />
              <Route path="/food" element={<Food />} />
              <Route path="/meals" element={<Meal />} />
              <Route path="/waste" element={<Waste />} />
              <Route path="/food-details/:mealId" element={<FoodDetails />} />
              <Route path="/cardapio" element={<Cardapio />} />
              <Route path="/cadastro" element={<SignUp />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
