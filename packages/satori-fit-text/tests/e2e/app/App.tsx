import FitText from "./FitText.js";
import Playground from "./Playground.js";

export default function App(): React.ReactElement {
  return (
    <main style={{ margin: "1rem" }}>
      <h1>Playground</h1>
      <Playground />
      <h1>Tests</h1>
      <FitText text="Hello I am the heading" width={800} height={450} />
      <FitText text="Hello I am the heading" width={300} height={50} />
      <FitText
        text="just a bunch of short words for the narrow thing"
        width={100}
        height={600}
      />
      <FitText
        text="A title with a final line w/o descender"
        width={1140}
        height={429}
      />
      <FitText
        text="A title with a final line with descenderg"
        width={1140}
        height={429}
      />
      <FitText
        text="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Similique, officia iusto quisquam deserunt pariatur ipsam dignissimos et suscipit laborum natus neque rerum nihil, ipsum hic nisi quo deleniti fugit. Exercitationem molestias placeat aspernatur veniam recusandae eum fugiat, distinctio!"
        lineHeight={0.5}
        width={1136}
        height={429}
      />
    </main>
  );
}
