import React from "react";

export default function Pagination({ currentPage, updatePage }) {
  function nextPage() {
    updatePage(currentPage + 1);

    console.log("update page : ", currentPage);
  }

  function prevPage() {
    if (currentPage === 1) {
      return;
    }

    updatePage(currentPage - 1);
  }

  return (
    <div className="w-full mt-4 flex items-center justify-center gap-8">
      <button
        className="border border-purple-600 cursor-pointer hover:bg-purple-600 transition-all  hover:text-white text-purple-600 px-4 py-1 rounded-md"
        onClick={prevPage}
      >
        prev
      </button>
      <button
        onClick={nextPage}
        className="border border-purple-600 cursor-pointer hover:bg-purple-600 transition-all  hover:text-white text-purple-600 px-4 py-1 rounded-md"
      >
        next
      </button>
    </div>
  );
}
