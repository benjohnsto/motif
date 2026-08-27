"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkmy_osd_project"] = self["webpackChunkmy_osd_project"] || []).push([["src_WordpressAdapter_js"],{

/***/ "./src/WordpressAdapter.js"
/*!*********************************!*\
  !*** ./src/WordpressAdapter.js ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Adapter)\n/* harmony export */ });\nclass Adapter {\n\n  constructor(annotationPageId, endpoint) {\n    this.annotationPageId = annotationPageId;\n    this.endpoint = endpoint;\n  }\n\n\n  async get() {\n    const annotationPage = await this.all();\n    if (annotationPage) {\n      return annotationPage;\n    }\n    return null;\n  }\n \n  \n\n  async create(annotation) {\n    console.log('create annotation');\n    return fetch(this.endpoint, {\n      body: JSON.stringify(annotation),\n      headers: {\n        Accept: 'application/json',\n        'Content-Type': 'application/json',\n      },\n      method: 'POST',\n    }).catch(() => this.all());\n  }\n  \n  async update(annotation) {\n    const annotationPage = await this.all();\n    if (annotationPage) {\n      const currentIndex = annotationPage.items.findIndex((item) => item.id === annotation.id);\n      annotationPage.items.splice(currentIndex, 1, annotation);\n      return fetch(this.endpoint, {\n        body: JSON.stringify(annotationPage),\n          headers: {\n          Accept: 'application/json',\n          'Content-Type': 'application/json',\n        },\n        method: 'PUT',\n      }).catch(() => this.all());\n\n    }\n    return null;\n    \n    \n    \n    \n    \n    \n  }\n  \n\n\n  async remove(annoId) {\n    const annotationPage = await this.all();\n    if (annotationPage) {\n      annotationPage.items = annotationPage.items.filter((item) => item.id !== annoId);\n    }\n    localStorage.setItem(this.annotationPageId, JSON.stringify(annotationPage));\n    return annotationPage;\n  }\n  \n  /** */\n  async all() {\n    \n    return fetch(`${this.endpoint}?canvas=${this.annotationPageId}`, {\n      headers: {\n        Accept: 'application/json',\n        'Content-Type': 'application/json',\n      },\n      method: 'GET',\n    }).then(response => {\n        if (!response.ok) {\n          throw new Error(`HTTP error! status: ${response.status}`);\n        }\n        return response.json();\n    }).then(data => {\n\t     return data;\n    })\n    .catch(() => this.all()); \n  }\n\n}\n\n\n//# sourceURL=webpack://my-osd-project/./src/WordpressAdapter.js?\n}");

/***/ }

}]);