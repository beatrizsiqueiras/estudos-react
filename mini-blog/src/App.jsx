import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Container } from "@chakra-ui/react";

import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
    return (
        <div className='App'>
            <BrowserRouter>
                <Navbar />
                <Container minH='60vh' marginBottom='5em'>
                    <Routes>
                        <Route path='/' element={<Home />}></Route>
                        <Route path='/about' element={<About />}></Route>
                    </Routes>
                </Container>
                <Footer />
            </BrowserRouter>
        </div>
    );
}

export default App;
