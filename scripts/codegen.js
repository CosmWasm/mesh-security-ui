const { join, resolve } = require("path");
const codegen = require("@cosmwasm/ts-codegen").default;

const contractsDir = resolve(join(__dirname, "/../schemas"));
const contracts = [
  {
    name: "HackCw20",
    dir: join(contractsDir, "cw20-base"),
  },
  {
    name: "MeshConsumer",
    dir: join(contractsDir, "mesh-consumer"),
  },
  {
    name: "MeshLockup",
    dir: join(contractsDir, "mesh-lockup"),
  },
  {
    name: "MeshProvider",
    dir: join(contractsDir, "mesh-provider"),
  },
  {
    name: "MeshSlasher",
    dir: join(contractsDir, "mesh-slasher"),
  },
  {
    name: "MetaStaking",
    dir: join(contractsDir, "meta-staking"),
  },
];

codegen({
  contracts,
  outPath: join(__dirname, "../codegen"),
  options: {
    bundle: {
      enabled: true,
      bundleFile: "index.ts",
      scope: "contracts",
    },
    types: {
      enabled: true,
    },
    client: {
      enabled: true,
    },
    messageComposer: {
      enabled: true,
    },
  },
})
  .then(() => {
    console.log("✨ all done!");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
