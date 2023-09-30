import Head from 'next/head';
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
} from '@chakra-ui/react';
import { BsFillMoonStarsFill, BsFillSunFill } from 'react-icons/bs';

import { useChain } from '@cosmos-kit/react';
import { WalletStatus } from '@cosmos-kit/core';

import { ContractsProvider, useContracts } from '../codegen/contracts-context';

import {
  chainName,
  cw20ContractAddress,
} from '../config';
import {
  Product,
  Dependency,
  handleChangeColorModeValue,
  HackCw20,
} from '../components';

import { WalletSection} from '../components/wallet-old'

import { useState } from 'react';

const library = {
  title: 'TS Codegen',
  text: 'The quickest and easiest way to convert CosmWasm Contracts into dev-friendly TypeScript classes.',
  href: 'https://github.com/CosmWasm/ts-codegen'
};

const ContractComponent = ({ children }: { children: any }) => {
  const { address, getCosmWasmClient, getSigningCosmWasmClient } = useChain(chainName);
  return (
    <ContractsProvider contractsConfig={{
      address,
      getCosmWasmClient,
      getSigningCosmWasmClient
    }}>
      {children}
    </ContractsProvider>
  );
};

const RenderBalance = () => {
  const { hackCw20 } = useContracts();
  const { address, status } = useChain(chainName);
  const [cw20Bal, setCw20Bal] = useState<string | null>(null);

  if (status === 'Connected' && hackCw20.cosmWasmClient) {
    const client = hackCw20.getQueryClient(cw20ContractAddress);
    client.balance({ address }).then((b) => setCw20Bal(b.balance));
  }

  if(!cw20Bal) return ( <Box>sad</Box> )

  	return (<Box>happy</Box>)

  return (
    <Box w="full" maxW="md" mx="auto">
      <HackCw20
        balance={cw20Bal}
        isConnectWallet={status !== WalletStatus.Disconnected}
      />
    </Box>
  );
}

const Layout = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { status } = useChain(chainName);

  return (
    <Container maxW="5xl" py={10}>
      <Head>
        <title>Create Cosmos App</title>
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
          Create Cosmos App
        </Heading>
        <Heading
          as="h1"
          fontWeight="bold"
          fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
        >
          <Text as="span">Welcome to&nbsp;</Text>
          <Text
            as="span"
            color={handleChangeColorModeValue(
              colorMode,
              'primary.500',
              'primary.200'
            )}
          >
            CosmosKit + Next.js +{' '}
            <a href={library.href} target="_blank" rel="noreferrer">
              {library.title}
            </a>
          </Text>
        </Heading>
      </Box>

      <WalletSection />

      {status === 'Connected' ? <RenderBalance /> : <div>connecting...</div>}

      <Box my={20}>
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

export function Home() {
  return (
    <ContractComponent>
      <Layout />
    </ContractComponent>
  );
}