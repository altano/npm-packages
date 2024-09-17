import React from "react";

interface Context {
  mountedElements: Set<Element>;
}

export const ElementObserverContext: React.Context<Context | null> =
  React.createContext<Context | null>(null);
