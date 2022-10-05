/**
* This file was automatically generated by @cosmwasm/ts-codegen@0.16.5.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

import { Coin } from "@cosmjs/amino";
import { MsgExecuteContractEncodeObject } from "cosmwasm";
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { toUtf8 } from "@cosmjs/encoding";
import { InstantiateMsg, ExecuteMsg, Decimal, QueryMsg, ConfigResponse } from "./MeshSlasher.types";
export interface MeshSlasherMessage {
  contractAddress: string;
  sender: string;
  submitEvidence: ({
    amount,
    validator
  }: {
    amount: Decimal;
    validator: string;
  }, funds?: Coin[]) => MsgExecuteContractEncodeObject;
}
export class MeshSlasherMessageComposer implements MeshSlasherMessage {
  sender: string;
  contractAddress: string;

  constructor(sender: string, contractAddress: string) {
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.submitEvidence = this.submitEvidence.bind(this);
  }

  submitEvidence = ({
    amount,
    validator
  }: {
    amount: Decimal;
    validator: string;
  }, funds?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          submit_evidence: {
            amount,
            validator
          }
        })),
        funds
      })
    };
  };
}