import type { Meta, StoryObj } from "@storybook/react";

import FloorCard from "../src/app/features/PropertyForm/components/FloorDetail/FloorCard";
import "../src/styles/FloorSection.css";

const meta: Meta<typeof FloorCard> = {
  title: "Agent/FloorCard",
  component: FloorCard,
  parameters: {
    layout: "centered",
  },
};
export default meta;
type Story = StoryObj<typeof FloorCard>;

/** Mock floor data matching the fields used by FloorCard */
const mockFloor = {
  floorNumber: "Ground Floor",
  buildingClassification: "Residential",
  natureOfUsage: "Owner Occupied",
  plinthArea: 1200,
  mezzanineArea: 0,
  length: 40,
  breadth: 30,
  igrsClassification: "",
  firmName: "",
  occupancy: "",
  occupantName: "",
  annualRent: "",
  occupancyDate: "",
  unOccupiedDate: "",
  rentStartDate: "",
  rentEndDate: "",
  constructionDate: "",
  effectiveFromDate: "",
  unstructuredLand: "",
  buildingPermissionNo: "",
  floorsDetailsEntered: false,
};

export const Single: Story = {
  args: {},
  render: () => (
    <div style={{ padding: 24, width: 100, height: 200, fontFamily: 'Roboto', fontWeight: 400, fontSize: 6 }}>
      <style>{`.floor-card{transform: scale(1.4); transform-origin: top left; display: inline-block; width: 300px !important;}`}</style>
      <FloorCard
        floor={mockFloor}
        index={0}
        onEdit={(floor) => {
          console.log("Edit clicked for floor:", floor);
        }}
        onDelete={(index) => {
          console.log("Delete clicked for index:", index);
        }}
      />
    </div>
  ),
};





