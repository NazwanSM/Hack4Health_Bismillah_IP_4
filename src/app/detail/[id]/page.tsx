"use client";

import DetailRumahSakit from "../../components/DetailRumahSakit";

export default function DetailPage({ params }) {
    return <DetailRumahSakit id={params.id} />;
}