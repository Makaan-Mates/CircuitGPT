"use client";

import { useRef } from "react";
import { useChat } from "ai/react";
import clsx from "clsx";
import {
  LoadingCircle,
  SendIcon,
  UserIcon,
} from "./icons";
import Textarea from "react-textarea-autosize";
import Image from "next/image";

const examples = [
  "How do I perform Insulation Resistance test?",
  "How do I perform Tan Delta test in current transformer?",
  "I'm getting high contact resistance readings on a circuit breaker. What should I do?",
];

export default function Chat() {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, input, setInput, handleSubmit, isLoading } = useChat({
    onResponse: (response) => {
      if (response.status === 429) {
        window.alert("You have reached your request limit for the day.");
        return;
      }
    },
  });

  const disabled = isLoading || input.length === 0;
  
  return (
    <main className="flex flex-col items-center justify-between pb-40 bg-[#1A1A1A]">
      <div className="absolute top-5 hidden w-full justify-between px-5 sm:flex">
       
     
      </div>
      {messages.length > 0 ? (
        messages.map((message, i) => (
          
          <div
            key={i}
            className={clsx(
              "flex w-full items-center justify-center  py-8",
              message.role === "user" ? "bg-[#1A1A1A]" : "bg-[#242424]",
            )}
          >
            <div className="flex text-[#a1a1a1] w-full max-w-screen-md items-start space-x-4 px-5 sm:px-0">
              <div
                className={clsx(
                  message.role === "assistant"
                    ? "bg-white"
                    : "bg-black p-1.5 text-white",
                )}
              >
                {message.role === "user" ? (
                  <UserIcon />
                ) : (
                  <Image
                    src="/scaleup.png"
                    alt="circuit-gpt"
                    width={36}
                    height={36}
                    className="bg-[#242424]"
                  />
                )}
              </div>
              <div className="prose prose-p:leading-relaxed mt-1 w-full break-words">
                {message.role === "assistant" ? (
            <ul className="list-inside list-none">
              {message.content.split('\n').map((line, index) => (
                <li key={index}>
                  {line.match(/^\d+\./) || line.startsWith(':') ? line : ` ${line}`}
                </li>
              ))}
            </ul>
          ) : (
            message.content
          )} 
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className=" border-[#272727] sm:mx-0 mx-5 mt-20 max-w-screen-md bg-[#1A1A1A] rounded-md border sm:w-full">
          <div className="flex flex-col space-y-4 p-7 sm:p-10">
            <img
              src="/scaleup.png"
              width={40}
              height={40}
              className="h-20 w-20 rounded-lg"
            />
            <h1 className="text-lg font-semibold text-[#f1f1f1]">
              Hi, I'm Circuit GPT!
            </h1>
            <p className="text-[#a1a1a1]">
              I can assist you in testing and maintainance of substation equipments and buy you some extra time for a date with your crush.
            </p>
          </div>
          <div className="flex flex-col space-y-4 border-t border-[#272727] bg-[#242424] p-7 sm:p-10">
            {examples.map((example, i) => (
              <button
                key={i}
                className="rounded-md   bg-[#313131] px-5 py-3 text-left text-sm text-[#a1a1a1] transition-all duration-75 hover:text-[#cccccc] "
                onClick={() => {
                  setInput(example);
                  inputRef.current?.focus();
                }}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="fixed bottom-0 flex w-full flex-col items-center space-y-3 bg-gradient-to-b from-transparent bg-[#1A1A1A] p-5 pb-3 sm:px-0">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="relative w-full max-w-screen-md rounded-xl border-none  bg-[#242424] px-4 pb-2 pt-3 shadow-lg sm:pb-3 sm:pt-4"
        >
          <Textarea
            ref={inputRef}
            tabIndex={0}
            required
            rows={1}
            autoFocus
            placeholder="Ask a query"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                formRef.current?.requestSubmit();
                e.preventDefault();
              }
            }}
            spellCheck={false}
            className="w-full pr-10 text-[#d4d3d3] .placeholder-[#a1a1a1] focus:outline-none bg-[#242424] "
          />
          <button
            className={clsx(
              "absolute inset-y-0 right-3 my-auto flex h-8 w-8 items-center justify-center rounded-md transition-all",
              disabled
                ? "cursor-not-allowed bg-[#242424]"
                : "bg-green-700 hover:bg-green-800",
            )}
            disabled={disabled}
          >
            {isLoading ? (
              <LoadingCircle />
            ) : (
              <SendIcon
                className={clsx(
                  "h-4 w-4",
                  input.length === 0 ? "text-gray-300" : "text-white",
                )}
              />
            )}
          </button>
        </form>
        <p className="text-center text-xs text-[#a1a1a1]">
          Circuit GPT is built using fine tuning of Open AI's GPT 3.5 turbo base model
        </p>
      </div>
    </main>
  );
}
