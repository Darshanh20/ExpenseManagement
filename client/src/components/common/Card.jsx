import { motion } from 'framer-motion';

const Card = ({ children, className = '', animate = true, ...props }) => {
  const Component = animate ? motion.div : 'div';

  const animationProps = animate ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  } : {};

  return (
    <Component
      className={`bg-white dark:bg-surface-dark rounded-lg shadow-md p-6 ${className}`}
      {...animationProps}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Card;
