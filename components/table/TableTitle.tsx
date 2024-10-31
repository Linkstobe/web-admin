"use client"

interface TabelTopSectionProps {
  title: string
}

export default function TableTitle ({
  title
}: TabelTopSectionProps) {
  return (
    <h2
      className="font-semibold"
    >
      { title }
    </h2>
  )
}