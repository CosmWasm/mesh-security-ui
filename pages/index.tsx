import { useEffect, useState, useMemo } from 'react';
import { useWallet } from '@cosmos-kit/react';
import { assets } from 'chain-registry';
import { AssetList, Asset } from '@chain-registry/types';

import {
  Box,
  Divider,
  Grid,
  Heading,
  Text,
  Stack,
  Container,
  Link,
  Button,
  Flex,
  Icon,
  useColorMode,
  useColorModeValue
} from '@chakra-ui/react';
import { BsFillMoonStarsFill, BsFillSunFill } from 'react-icons/bs';
import { dependencies, products } from '../config';

import { WalletStatus } from '@cosmos-kit/core';
import { Product, Dependency, WalletSection } from '../components';
import Head from 'next/head';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { Coin } from "cosmwasm";

const library = {
  title: 'OsmoJS',
  text: 'OsmoJS',
  href: 'https://github.com/osmosis-labs/osmojs'
};

// const chainName = 'osmosis';
// const chainName = 'osmosistestnet';
// const denom = 'uosmo';
const chainName = 'junotestnet';
const denom = 'ujunox';

const chainassets: AssetList = assets.find(
  (chain) => chain.chain_name === chainName
) as AssetList;
const coin: Asset = chainassets.assets.find(
  (asset) => asset.base === denom
) as Asset;

export default function Home() {
  const { colorMode, toggleColorMode } = useColorMode();

  const {
    getStargateClient,
    getCosmWasmClient,
    address,
    setCurrentChain,
    currentWallet,
    walletStatus
  } = useWallet();

  useEffect(() => {
    setCurrentChain(chainName);
  }, [chainName]);

  const color = useColorModeValue('primary.500', 'primary.200');

  // get cw20 balance
  const [client, setClient] = useState<SigningCosmWasmClient | null>(
    null
  );

  useEffect(() => {
    getCosmWasmClient().then((cosmwasmClient) => {
      if (!cosmwasmClient || !address) {
        console.error('stargateClient undefined or address undefined.');
        return;
      }
      setClient(cosmwasmClient);
    });
  }, [address, getCosmWasmClient]);
  const [bal, setBal] = useState<Coin | null>(null);
  useEffect(() => {
    if (client && address) {
      client
        .getBalance(address, denom)
        .then((b) => setBal(b));
    }
  }, [client, address]);

  return (
    <Container maxW="5xl" py={10}>
      <Head>
        <title>Mesh Security Testnet</title>
        <meta name="description" content="Generated by create cosmos app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex justifyContent="end" mb={4}>
        <Button variant="outline" px={0} onClick={toggleColorMode}>
          <Icon
            as={colorMode === 'light' ? BsFillMoonStarsFill : BsFillSunFill}
          />
        </Button>
      </Flex>
      <Box textAlign="center">
        <Heading
          as="h1"
          fontSize={{ base: '3xl', sm: '4xl', md: '5xl' }}
          fontWeight="extrabold"
          mb={3}
        >
          Mesh Security
        </Heading>
        <Heading
          as="h1"
          fontWeight="bold"
          fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
        >
          <Text as="span">Live On&nbsp;</Text>
          <Text as="span" color={color}>
            Juno uni-5 + Osmosis osmo-test-4
          </Text>
        </Heading>
      </Box>
      <WalletSection chainName={chainName} />

      <div>
        {denom} Balance:{' '}
        {walletStatus === WalletStatus.Disconnected
          ? 'Connect wallet!'
          : bal?.amount ?? 'loading...'}
      </div>

      {walletStatus === WalletStatus.Disconnected && (
        <Box textAlign="center">
          <Heading
            as="h3"
            fontSize={{ base: '1xl', sm: '2xl', md: '2xl' }}
            fontWeight="extrabold"
            m={30}
          >
            Connect your wallet!
          </Heading>
        </Box>
      )}

      <Box mb={3}>
        <Divider />
      </Box>

      <Box mb={3}>
        <Divider />
      </Box>
      <Stack
        isInline={true}
        spacing={1}
        justifyContent="center"
        opacity={0.5}
        fontSize="sm"
      >
        <Text>Built with</Text>
        <Link
          href="https://cosmology.tech/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Cosmology
        </Link>
      </Stack>
    </Container>
  );
}
