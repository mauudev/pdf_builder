import React, { ReactElement } from 'react'
import { View } from '@react-pdf/renderer'
import { IHeaderBuilder, IBlock, RawJSON } from '../contracts'
import { parseStyle } from '../utils'
import HeaderBlock from '../blocks/headers/headers'
import { HeaderBuilderException } from '../exceptions'

/**
 * Builder de componentes de tipo 'header'
 */
class HeaderBlockBuilder implements IHeaderBuilder {
  private blockComponent: IBlock | undefined

  constructor() {
    this.blockComponent = new HeaderBlock()
  }

  getBlockComponent(): IBlock | undefined {
    return this.blockComponent
  }

  getBuiltBlock(rawJson: RawJSON, resetBlock?: boolean): ReactElement {
    if (!rawJson || !rawJson.key) {
      throw new HeaderBuilderException('Invalid rawJson format or missing key')
    }
    const block = this.buildHeaderBlock(rawJson)
    if (resetBlock) {
      this.getBlockComponent()?.reset()
    }
    return block
  }

  buildHeaderBlock(rawJson: RawJSON): ReactElement {
    let blockStyle = {}
    if (rawJson && rawJson.data ? Object.keys(rawJson.data).length : 0) {
      const [style, value] = Object.entries(rawJson.data)[0]
      blockStyle = parseStyle(style, value)
    }
    return (
      <View key={rawJson.key} style={blockStyle}>
        {this.blockComponent?.getComponent(rawJson)}
      </View>
    )
  }
}

export default HeaderBlockBuilder
