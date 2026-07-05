import { useState } from "react";

export function useAddForm(onAdd: (name: string, category: string) => void) {
  const [input, setInput] = useState("");
  const [catInput, setCatInput] = useState("");

  function submit() {
    onAdd(input, catInput);
    setInput("");
    setCatInput("");
  }

  return { input, setInput, catInput, setCatInput, submit };
}
