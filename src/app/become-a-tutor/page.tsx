"use client";

import React from "react";
import BecomeATutorModal from "@/components/BecomeATutorModal";
import { useState } from "react";

export default function BecomeATutorPage() {
  const [open, setOpen] = useState(true);

  return (
    <div className="page">
      <BecomeATutorModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}