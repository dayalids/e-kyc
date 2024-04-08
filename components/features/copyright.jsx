import React, { useState, useEffect } from 'react';

const CopyrightFooter = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentYear(new Date().getFullYear());
    }, 60000); // Update every minute, you can adjust the interval as needed

    return () => clearInterval(interval);
  }, []);

  return (
    <div >
      <p> Copyright &copy; {currentYear} IDS. All rights reserved.</p>
    </div>
  );
};

export default CopyrightFooter;
