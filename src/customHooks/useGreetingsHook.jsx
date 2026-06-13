import { useEffect, useState } from "react";

const useGreetingsHook = () => {
  const [time, setTime] = useState(new Date());
  const [greetings, setGreetings] = useState("");

  // ✅ Fixed: interval inside useEffect with proper cleanup — was leaking on every render
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const currentTime = time.getHours();
    if (currentTime >= 6 && currentTime < 12) {
      setGreetings("Good Morning! Have a good day.");
    } else if (currentTime >= 12 && currentTime < 17) {
      setGreetings("Good Afternoon!");
    } else if (currentTime >= 17 && currentTime < 24) {
      setGreetings("Hey! Good Evening");
    } else {
      setGreetings("Good Night! Take some rest");
    }
  }, [time]);

  return [greetings, time];
};

export default useGreetingsHook;
