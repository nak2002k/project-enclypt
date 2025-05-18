// src/components/FeatureBlock.tsx
import { motion } from "framer-motion"

export function FeatureBlock({
  title,
  desc,
  Icon,
  reverse = false,
}: {
  title: string
  desc: string
  Icon: React.ElementType
  reverse?: boolean
}) {
  return (
    <motion.div
      className={`flex flex-col md:flex-row items-center gap-10 my-20 md:my-28 ${
        reverse ? "md:flex-row-reverse" : ""
      }`}
      initial={{ opacity: 0, x: reverse ? 80 : -80 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="flex-1">
        <h3 className="text-2xl md:text-3xl font-bold mb-2 text-gray-100">{title}</h3>
        <p className="text-gray-400 text-lg md:text-xl max-w-lg">{desc}</p>
      </div>
      <div className="flex-1 flex justify-center items-center">
        <Icon className="w-24 h-24 md:w-32 md:h-32 text-indigo-400 drop-shadow-lg" />
      </div>
    </motion.div>
  )
}
