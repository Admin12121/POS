import React from "react";
import style from './style.module.scss'
const Loader = () => {
  return (
    <>
    <div className={style.loader_wrapper}>
    <svg className={style.Loader} viewBox="25 25 50 50">
        <circle className={style.comp} r="20" cy="50" cx="50"></circle>
      </svg>
    </div>
    </>
  );
};

export default Loader;
