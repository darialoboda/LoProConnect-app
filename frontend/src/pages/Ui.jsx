import Container from "../components/Container";

export default function Ui() {
  return (
    <Container>

        <div className="box-items">
            <h2 className="box-title">Buttons</h2>
            <div className="box-items d-flex gap-10 flex-items-center">
                <button className="btn btn-sm">Send</button>
                <button className="btn">Send</button>
                <button className="btn btn-icon btn-sm">+</button>
                <button className="btn btn-icon">+</button>
                <button className="btn btn-icon btn-round btn-sm">+</button>
                <button className="btn btn-icon btn-round">+</button>
            </div>
        </div>

    </Container>
  )
}
