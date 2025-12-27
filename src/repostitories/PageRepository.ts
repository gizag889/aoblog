import React from "react";
import Repository from "./Repository";

class PageRepository {
  static getPage() {
    return Repository(`query MyQuery {
  page(id: "/portfolio", idType: URI) {
    title
    content
  }
}`).getWp();
  }
}

export default PageRepository;
