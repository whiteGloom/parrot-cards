import { useState } from 'react';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-2 shadow border-b-2 w-full gap-2 justify-end flex">
      <div className="relative">
        <button className="p-2 rounded hover:bg-blue-50 border border-gray-300" onClick={() => setIsOpen(!isOpen)}>
          Save
        </button>
        {isOpen && (
          <div
            className="absolute top-full mt-1 right-0 bg-white  shadow-lg/50 border border-gray-300 rounded-3xl rounded-tr  flex flex-col gap-1 p-1.5"
          >
            <button
              className="p-2 rounded-2xl rounded-b rounded-tr hover:bg-blue-50 border border-gray-300 whitespace-nowrap"
            >
              To Google Drive
            </button>

            <button
              className="p-2 rounded-2xl rounded-t hover:bg-blue-50 border border-gray-300 whitespace-nowrap"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              To local file
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
