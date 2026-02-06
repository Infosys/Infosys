import type { Meta, StoryObj } from "@storybook/react";

import OwnerCardDetail from "../src/app/features/PropertyForm/components/OwnerDetail/OwnerCardDetail";
import "../src/styles/OwnerCardDetail.css";

const meta: Meta<typeof OwnerCardDetail> = {
  title: "Agent/CardDetail",
  component: OwnerCardDetail,
};
export default meta;
type Story = StoryObj<typeof OwnerCardDetail>;

export const Default: Story = {
  args: {
    name: "Ravi Kumar",
    isPrimary: false,
    isDetailed: false,
    primaryOwnerText: "Primary Owner",
    guardianLabel: "Guardian",
  },
  render: (args) => (
    <div style={{ padding: 16, fontFamily: 'Roboto, Arial, sans-serif' }}>
      <OwnerCardDetail
        {...args}
        onDelete={() => {
          // mock handler - does not call any API or redux
          // eslint-disable-next-line no-console
          console.log("onDelete clicked for", args.name);
        }}
        onEdit={() => {
          // eslint-disable-next-line no-console
          console.log("onEdit clicked for", args.name);
        }}
      />
    </div>
  ),
};

export const DetailedPrimary: Story = {
  args: {
    name: "Anita Sharma",
    isPrimary: true,
    isDetailed: true,
    aadhar: "1234 5678 9012",
    mobile: "9876543210",
    email: "anita@example.com",
    guardian: "Suresh Sharma",
    guardianRelationship: "",
    primaryOwnerText: "Primary Owner",
    guardianLabel: "Guardian",
  },
  render: (args) => (
    <div style={{ padding: 16, fontFamily: 'Roboto, Arial, sans-serif' }}>
      <OwnerCardDetail
        {...args}
        onDelete={() => {
          // eslint-disable-next-line no-console
          console.log("onDelete clicked for", args.name);
        }}
        onEdit={() => {
          // eslint-disable-next-line no-console
          console.log("onEdit clicked for", args.name);
        }}
      />
    </div>
  ),
};