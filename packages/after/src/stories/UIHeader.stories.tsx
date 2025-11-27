import type { Meta, StoryObj } from "@storybook/react-vite";
import { Header } from "../components/ui/header";

const meta = {
  title: "Components/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithContent: Story = {
  render: () => (
    <div>
      <Header />
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">페이지 콘텐츠</h1>
        <p>Header는 sticky 속성으로 스크롤 시 상단에 고정됩니다.</p>
        {Array.from({ length: 20 }, (_, i) => (
          <p key={i} className="mb-2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Line {i + 1}
          </p>
        ))}
      </div>
    </div>
  ),
};

