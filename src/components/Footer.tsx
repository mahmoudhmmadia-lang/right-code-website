import Container from "./Container"
import LangHandler from "./LangHandler"

function Footer() {
  return (
    <Container className="z-10 flex flex-col items-center justify-center bg-alt py-20">
      <img src="/logo.png" className="w-30" alt="logo" />
      <div className="flex flex-wrap justify-center gap-8">
        <span className="inline-flex items-center gap-2 text-sm font-medium text-[#5a7a78]">
          <i className="fas fa-code" />
          <LangHandler content="tag1" />
        </span>
        <span className="inline-flex items-center gap-2 text-sm font-medium text-[#5a7a78]">
          <i className="fas fa-shield-alt" />
          <LangHandler content="tag2" />
        </span>
        <span className="inline-flex items-center gap-2 text-sm font-medium text-[#5a7a78]">
          <i className="fas fa-rocket" />
          <LangHandler content="tag3" />
        </span>
      </div>
      <p className="mt-6 text-xs text-main">
        © {new Date().getFullYear()} RIGHT CODE — Engineering the future, today
      </p>
    </Container>
  )
}

export default Footer
