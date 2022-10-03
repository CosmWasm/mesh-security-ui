/**
* This file was automatically generated by @cosmwasm/ts-codegen@0.16.5.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

import { CosmWasmClient, SigningCosmWasmClient, ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { Coin, StdFee } from "@cosmjs/amino";
import { InstantiateMsg, ExecuteMsg, Decimal, QueryMsg, ConfigResponse } from "./MeshSlasher.types";
export interface MeshSlasherReadOnlyInterface {
  contractAddress: string;
  config: () => Promise<ConfigResponse>;
}
export class MeshSlasherQueryClient implements MeshSlasherReadOnlyInterface {
  client: CosmWasmClient;
  contractAddress: string;

  constructor(client: CosmWasmClient, contractAddress: string) {
    this.client = client;
    this.contractAddress = contractAddress;
    this.config = this.config.bind(this);
  }

  config = async (): Promise<ConfigResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      config: {}
    });
  };
}
export interface MeshSlasherInterface extends MeshSlasherReadOnlyInterface {
  contractAddress: string;
  sender: string;
  submitEvidence: ({
    amount,
    validator
  }: {
    amount: Decimal;
    validator: string;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
}
export class MeshSlasherClient extends MeshSlasherQueryClient implements MeshSlasherInterface {
  client: SigningCosmWasmClient;
  sender: string;
  contractAddress: string;

  constructor(client: SigningCosmWasmClient, sender: string, contractAddress: string) {
    super(client, contractAddress);
    this.client = client;
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.submitEvidence = this.submitEvidence.bind(this);
  }

  submitEvidence = async ({
    amount,
    validator
  }: {
    amount: Decimal;
    validator: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      submit_evidence: {
        amount,
        validator
      }
    }, fee, memo, funds);
  };
}