"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkmy_osd_project"] = self["webpackChunkmy_osd_project"] || []).push([["src_LocalStorageAdapter_js"],{

/***/ "./src/LocalStorageAdapter.js"
/*!************************************!*\
  !*** ./src/LocalStorageAdapter.js ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ LocalStorageAdapter)\n/* harmony export */ });\nclass LocalStorageAdapter {\n\n  constructor(annotationPageId, endpoint) {\n    this.annotationPageId = annotationPageId;\n    this.endpoint = endpoint;\n  }\n\n\n  async get() {\n    const annotationPage = await this.all();\n    if (annotationPage) {\n      return annotationPage;\n    }\n    return null;\n  }\n \n  \n\n  async create(annotation) {\n    const emptyAnnoPage = {\n      id: this.annotationPageId,\n      items: [],\n      type: 'AnnotationPage',\n    };\n    const annotationPage = await this.all() || emptyAnnoPage;\n    \n    annotationPage.items.push(annotation);\n    localStorage.setItem(this.annotationPageId, JSON.stringify(annotationPage));\n    console.log('CREATE ANNOTATION', annotationPage);\n    return annotationPage;\n  }\n  \n  async update(annotation) {\n\n    const annotationPage = await this.all();\n    if (annotationPage) {\n      const currentIndex = annotationPage.items.findIndex((item) => item.id === annotation.id);\n      annotationPage.items.splice(currentIndex, 1, annotation);\n      localStorage.setItem(this.annotationPageId, JSON.stringify(annotationPage));\n      console.log('UPDATE ANNOTATION', annotationPage);\n      return annotationPage;\n    }\n    return null;\n  }\n  \n  \n  \n  \n\n\n  async remove(annoId) {\n    const annotationPage = await this.all();\n    if (annotationPage) {\n      annotationPage.items = annotationPage.items.filter((item) => item.id !== annoId);\n    }\n    localStorage.setItem(this.annotationPageId, JSON.stringify(annotationPage));\n    return annotationPage;\n  }\n  \n  /** */\n  async all() {\n    return JSON.parse(localStorage.getItem(this.annotationPageId));\n  }\n\n}\n\n\n//# sourceURL=webpack://my-osd-project/./src/LocalStorageAdapter.js?\n}");

/***/ }

}]);