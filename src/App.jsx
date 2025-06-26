import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import { motion, AnimatePresence, useSpring, useMotionValue } from "framer-motion";
import "./App.css";

function MouseFollowBox() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springX = useSpring(x, { stiffness: 100, damping: 10 });
  const springY = useSpring(y, { stiffness: 100, damping: 10 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [x, y]);

  return (
    <motion.div
      style={{
        ...box,
        x: springX,
        y: springY,
        position: 'fixed', // Change to fixed positioning
        top: 0,
        left: 0,
        pointerEvents: 'none' // Prevent interfering with mouse events
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 1 }}
    />
  );
}


function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dragConstraints, setDragConstraints] = useState({
    top: -200,
    left: -200,
    right: 200,
    bottom: 200,
  });

   useEffect(() => {
    const calculateConstraints = () => {
      const margin = 100; // Adjust this value to control how much smaller
      const constraints = {
        top: -window.innerHeight/2 + margin,
        left: -window.innerWidth/2 + margin,
        right: window.innerWidth/2 - margin,
        bottom: window.innerHeight/2 - margin
      };
      setDragConstraints(constraints);
    };

    calculateConstraints();
    window.addEventListener('resize', calculateConstraints);
    
    return () => window.removeEventListener('resize', calculateConstraints);
  }, []);


  async function greet() {
    setIsLoading(true);
    try {
      setGreetMsg(await invoke("greet", { name }));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <motion.main 
      className="container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h1
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Welcome to Tauri + React
      </motion.h1>

      <motion.div 
        className="row"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <motion.a 
          href="https://vitejs.dev" 
          target="_blank"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </motion.a>
        <motion.a 
          href="https://tauri.app" 
          target="_blank"
          whileHover={{ scale: 1.1, rotate: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </motion.a>
        <motion.a 
          href="https://reactjs.org" 
          target="_blank"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={{ rotate: 360 }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" }
          }}
        >
          <img src={reactLogo} className="logo react" alt="React logo" />
        </motion.a>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        Click on the Tauri, Vite, and React logos to learn more.
      </motion.p>

      <motion.form
        className="row"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <motion.input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
          whileFocus={{ scale: 1.02, borderColor: "#646cff" }}
          transition={{ duration: 0.2 }}
        />
        <motion.button 
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={isLoading ? { rotate: 360 } : {}}
          transition={isLoading ? { duration: 1, repeat: Infinity, ease: "linear" } : { duration: 0.2 }}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Greet"}
        </motion.button>
      </motion.form>

      <AnimatePresence mode="wait">
        {greetMsg && (
          <motion.p
            key={greetMsg}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{ 
              background: "linear-gradient(45deg, #646cff, #747bff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: "bold",
              fontSize: "1.2em"
            }}
          >
            {greetMsg}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Updated container with all three boxes */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100%',
        gap: '100px',
        position: 'relative' // Added for MouseFollowBox positioning
      }}>
        {/* First Box */}
        <motion.div
          style={{
            ...box,
            cursor: 'pointer'
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1 }}
          whileHover={{ 
            scale: 1.2,
            rotate: 180,
            transition: { duration: 0.3 }
          }}
          whileTap={{ 
            scale: 0.8,
            rotate: -180,
            transition: { duration: 0.1 }
          }}
          drag
          dragConstraints={{
            top: -100,
            left: -100,
            right: 100,
            bottom: 100,
          }}
          onDragStart={() => console.log("Box 1: Drag started")}
          onDragEnd={() => console.log("Box 1: Drag ended")}
        />

        {/* Second Box */}
        <motion.div
      style={box}
      animate={{ rotate: 360 }}
      transition={{ duration: 1 }}
      drag
      dragConstraints={dragConstraints}
      whileDrag={{ 
        scale: 1.2,
        cursor: "grabbing"
      }}
      dragElastic={0.1}
      dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
    />

        {/* Third Box - MouseFollowBox */}
        <MouseFollowBox />
      </div>
    </motion.main>
  );
}

//Styles
const box = {
    width: 100,
    height: 100,
    backgroundColor: "#ff0088",
    borderRadius: 5,
}

const container = {
    width: 100,
    height: 50,
    backgroundColor: "var(--hue-3-transparent)",
    borderRadius: 50,
    cursor: "pointer",
    display: "flex",
    padding: 10,
}

const handle = {
    width: 50,
    height: 50,
    backgroundColor: "#9911ff",
    borderRadius: "50%",
}

export default App;
