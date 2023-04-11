const Moralis = require("moralis").default;

//Initiating Moralis
Moralis.start({
  apiKey: process.env.MORALIS_API_KEY,
});

const erc20MiddleWare = async (req, res, next) => {
  const { body, headers } = req;
  try {
    //Verify Moralis signature
    await Moralis.Streams.verifySignature({
      body,
      signature: headers["x-signature"],
    });
  } catch (e) {
    console.log(
      "Not Moralis!... An intruder attempted to send a request to the server"
    );
    console.log(e);
    return res.status(401).json({ error: "Not verified as moralis stream" });
  }
  const streamId = body.streamId;
  const confirmed = body.confirmed;
  const blockNumber = body.block.number;
  const blockTime = body.block.timestamp;
  let eventTime = new Date(parseInt(blockTime) * 1000).toString();
  const txHash = body?.logs[0]?.transactionHash?.toLowerCase();
  const chainId = body.chainId;
  const amountInUSD = parseFloat(body.erc20Transfers[0].valueWithDecimals);
  const amountWithoutDecimals = parseFloat(body.erc20Transfers[0].value);
  const tokenAddress =
    body.erc20Transfers[0].contract || body.erc20Transfers[0].tokenAddress;
  const tokenDecimals = body.erc20Transfers[0].tokenDecimals;
  let response;
  try {
    response = await Moralis.EvmApi.transaction.getTransaction({
      transactionHash: txHash,
      chain: chainId,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "error getting transaction" });
  }
  const senderAddress = response.data.from_address.toLowerCase();
  const data = {
    confirmed,
    blockNumber,
    blockTime,
    eventTime,
    txHash,
    chainId,
    amountInUSD,
    senderAddress,
    decimals,
    tokenDecimals,
    tokenAddress,
    amountWithoutDecimals,
    streamId,
  };
  req.data = data;
  next();
};

module.exports = { erc20MiddleWare };
