// src/components/LandingSection.tsx
import { motion } from "framer-motion"

export default function LandingSection({
  icon: Icon,
  title,
  desc,
  story,
  flip = false,
  inView = true,
}: {
  icon: React.ElementType
  title: string
  desc: string
  story: string
  flip?: boolean // for right/left swap
  inView?: boolean // animate only if in view
}) {
  return (
    <motion.section
      className={`grid grid-cols-1 md:grid-cols-2 items-center gap-12 py-16`}
      initial={{ opacity: 0, x: flip ? 100 : -100 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      exit={{ opacity: 0, x: flip ? 100 : -100 }}
      transition={{ duration: 0.7, type: "spring" }}
    >
      <div className={`flex flex-col justify-center items-${flip ? "end" : "start"} md:pr-12`}>
        <h2 className="text-4xl font-bold mb-4">{title}</h2>
        <p className="text-xl mb-2 text-gray-500 dark:text-gray-300">{desc}</p>
        <p className="text-md text-gray-400 dark:text-gray-400">{story}</p>
      </div>
      <div className={`flex justify-center md:justify-${flip ? "start" : "end"} relative`}>
        <motion.div
          className="bg-gradient-to-tr from-indigo-400/30 to-indigo-900/80 rounded-full shadow-2xl p-10"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <Icon className="w-28 h-28 text-indigo-400 dark:text-indigo-200 drop-shadow-lg" />
        </motion.div>
      </div>
    </motion.section>
  )
}
