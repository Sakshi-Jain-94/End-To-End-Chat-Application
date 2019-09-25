-- MySQL dump 10.13  Distrib 5.7.27, for Linux (x86_64)
--
-- Host: localhost    Database: my-chat
-- ------------------------------------------------------
-- Server version	5.7.27-0ubuntu0.18.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `agentsInfo`
--

DROP TABLE IF EXISTS `agentsInfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `agentsInfo` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `agentID` varchar(100) COLLATE latin1_bin NOT NULL,
  `password` varchar(100) COLLATE latin1_bin NOT NULL DEFAULT 'passcode',
  `createdOn` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `name` varchar(100) COLLATE latin1_bin NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1 COLLATE=latin1_bin COMMENT='agent info for assigned chats';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agentsInfo`
--

LOCK TABLES `agentsInfo` WRITE;
/*!40000 ALTER TABLE `agentsInfo` DISABLE KEYS */;
INSERT INTO `agentsInfo` VALUES (1,'narendra.kumar@mychat.in','passcode','2019-09-19 22:41:40','narendra'),(5,'test.chat@mychat.in','passcode','2019-09-25 11:08:52','test');
/*!40000 ALTER TABLE `agentsInfo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chatInfo`
--

DROP TABLE IF EXISTS `chatInfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chatInfo` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `customerID` int(11) NOT NULL,
  `agentID` varchar(100) COLLATE latin1_general_cs DEFAULT NULL,
  `createdOn` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('p','a','c') COLLATE latin1_general_cs NOT NULL DEFAULT 'p',
  `department` varchar(100) COLLATE latin1_general_cs DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_general_cs;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chatInfo`
--

LOCK TABLES `chatInfo` WRITE;
/*!40000 ALTER TABLE `chatInfo` DISABLE KEYS */;
/*!40000 ALTER TABLE `chatInfo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customerChats`
--

DROP TABLE IF EXISTS `customerChats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customerChats` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `chatID` int(11) NOT NULL,
  `customerID` int(11) NOT NULL,
  `agentID` varchar(100) COLLATE latin1_bin DEFAULT NULL,
  `message` varchar(288) COLLATE latin1_bin DEFAULT NULL,
  `msgBy` varchar(100) COLLATE latin1_bin DEFAULT NULL,
  `createdOn` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `intent` varchar(100) COLLATE latin1_bin DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `customerChats_CustomerID_IDX` (`customerID`,`agentID`) USING BTREE,
  KEY `customerChats_USERID_IDX` (`customerID`) USING BTREE,
  KEY `customerChats_agentID_IDX` (`agentID`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customerChats`
--

LOCK TABLES `customerChats` WRITE;
/*!40000 ALTER TABLE `customerChats` DISABLE KEYS */;
/*!40000 ALTER TABLE `customerChats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'my-chat'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-09-25 11:09:31
