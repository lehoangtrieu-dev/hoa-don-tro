import { Navbar } from "./components/Navbar";
import { RoomSelector } from "./components/RoomSelector";

export const App = () => {
  return (
    <div className="w-full max-w-sm mx-auto flex flex-col justify-center items-center p-6 gap-2">
      <Navbar />
      <RoomSelector />
    </div>
  );
};
