
export interface TextElement {
    text: string
}

export interface Node extends TextElement {
    x: number
    y: number
    isAcceptState: boolean
}

export interface Link extends TextElement {
    type?: "Link"
    nodeA: number
    nodeB: number
    text: string
    lineAngleAdjust: number
    parallelPart: number
    perpendicularPart: number
}

export interface SelfLink extends TextElement {
    type: "SelfLink"
    node: number
    anchorAngle: number
}

export interface StartLink extends TextElement {
    type: "StartLink"
    node: number
    deltaX: number
    deltaY: number
}

export type AnyLink = Link | SelfLink | StartLink

export interface GraphDocument {
    nodes: Node[]
    links: AnyLink[]
}

export interface InteractiveGraphDocument extends GraphDocument {
    selectedObject: GraphDocument
    caretVisible: boolean
    caretPosition: number
}
