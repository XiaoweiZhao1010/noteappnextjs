export default function Footer() {
  return (
    <footer className="mt-8 border-t bg-white/70 px-4 py-4 text-center text-sm text-slate-600">
      <p>Made with ❤️ by Yours Truly</p>
      <p className="mt-2 flex flex-wrap justify-center gap-4">
        <a
          href="https://github.com/XiaoweiZhao1010"
          className="text-[#5f81a6] hover:underline"
        >
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/xiaowei-zhao-0aa97b1bb/"
          className="text-[#5f81a6] hover:underline"
        >
          LinkedIn
        </a>
      </p>
      <p className="mt-2">
        This project is licensed under the MIT License — feel free to use,
        modify, and share it with attribution.
      </p>
    </footer>
  );
}

